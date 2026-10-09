import Foundation
import AppKit
import AVFoundation
import CoreImage

public final class CameraManager: NSObject, AVCapturePhotoCaptureDelegate {
    public static let shared = CameraManager()

    private var captureSession: AVCaptureSession?
    private var photoOutput: AVCapturePhotoOutput?
    private var completionHandler: ((String?) -> Void)?

    private override init() {
        super.init()
    }

    public func captureQuickSelfie(completion: @escaping (String?) -> Void) {
        self.completionHandler = completion

        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            self.startSessionAndCapture()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    if granted {
                        self?.startSessionAndCapture()
                    } else {
                        self?.completionHandler?(nil)
                    }
                }
            }
        default:
            print("[CameraManager] Camera access denied or restricted")
            completion(nil)
        }
    }

    private func startSessionAndCapture() {
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }

            let session = AVCaptureSession()
            session.sessionPreset = .photo

            guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) ?? AVCaptureDevice.default(for: .video),
                  let input = try? AVCaptureDeviceInput(device: camera),
                  session.canAddInput(input) else {
                print("[CameraManager] Unable to access camera device")
                DispatchQueue.main.async { self.completionHandler?(nil) }
                return
            }

            // Lock camera to enable continuous auto-exposure and white-balance
            do {
                try camera.lockForConfiguration()
                if camera.isExposureModeSupported(.continuousAutoExposure) {
                    camera.exposureMode = .continuousAutoExposure
                }
                if camera.isWhiteBalanceModeSupported(.continuousAutoWhiteBalance) {
                    camera.whiteBalanceMode = .continuousAutoWhiteBalance
                }
                camera.unlockForConfiguration()
            } catch {
                print("[CameraManager] Could not lock camera for configuration: \(error)")
            }

            session.addInput(input)

            let output = AVCapturePhotoOutput()
            guard session.canAddOutput(output) else {
                print("[CameraManager] Unable to add photo output")
                DispatchQueue.main.async { self.completionHandler?(nil) }
                return
            }

            session.addOutput(output)
            session.startRunning()

            self.captureSession = session
            self.photoOutput = output

            // Allow 1.25s for auto-exposure and white balance to calibrate before snapping
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.25) {
                let settings = AVCapturePhotoSettings()
                output.capturePhoto(with: settings, delegate: self)
            }
        }
    }

    public func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        defer {
            captureSession?.stopRunning()
            captureSession = nil
            photoOutput = nil
        }

        guard error == nil,
              let data = photo.fileDataRepresentation(),
              let originalImage = NSImage(data: data) else {
            DispatchQueue.main.async { self.completionHandler?(nil) }
            return
        }

        let brightened = autoEnhanceBrightness(image: originalImage)
        let compressed = downsampleAndCompress(image: brightened, maxPixelSize: 520, quality: 0.85)
        DispatchQueue.main.async {
            self.completionHandler?(compressed)
        }
    }

    private func autoEnhanceBrightness(image: NSImage) -> NSImage {
        guard let tiffData = image.tiffRepresentation,
              let ciImage = CIImage(data: tiffData) else {
            return image
        }

        let context = CIContext(options: [.useSoftwareRenderer: false])
        var outputCI = ciImage

        let extentVector = CIVector(x: ciImage.extent.origin.x, y: ciImage.extent.origin.y, z: ciImage.extent.size.width, w: ciImage.extent.size.height)
        var avgLuminance = 0.5
        if let filter = CIFilter(name: "CIAreaAverage", parameters: [kCIInputImageKey: ciImage, kCIInputExtentKey: extentVector]),
           let avgImage = filter.outputImage {
            var bitmap = [UInt8](repeating: 0, count: 4)
            context.render(avgImage, toBitmap: &bitmap, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1), format: .RGBA8, colorSpace: nil)
            avgLuminance = (0.299 * Double(bitmap[0]) + 0.587 * Double(bitmap[1]) + 0.114 * Double(bitmap[2])) / 255.0
        }

        if avgLuminance < 0.48 {
            let evBoost = min(1.0, (0.50 - avgLuminance) * 2.0)
            if let expFilter = CIFilter(name: "CIExposureAdjust") {
                expFilter.setValue(outputCI, forKey: kCIInputImageKey)
                expFilter.setValue(evBoost, forKey: kCIInputEVKey)
                if let result = expFilter.outputImage {
                    outputCI = result
                }
            }

            if let shadowFilter = CIFilter(name: "CIHighlightShadowAdjust") {
                shadowFilter.setValue(outputCI, forKey: kCIInputImageKey)
                shadowFilter.setValue(1.25, forKey: "inputShadowAmount")
                if let result = shadowFilter.outputImage {
                    outputCI = result
                }
            }
        }

        let autoFilters = outputCI.autoAdjustmentFilters(options: [
            .enhance: true,
            .redEye: false
        ])
        for filter in autoFilters {
            filter.setValue(outputCI, forKey: kCIInputImageKey)
            if let result = filter.outputImage {
                outputCI = result
            }
        }

        if let vibranceFilter = CIFilter(name: "CIVibrance") {
            vibranceFilter.setValue(outputCI, forKey: kCIInputImageKey)
            vibranceFilter.setValue(0.18, forKey: "inputAmount")
            if let result = vibranceFilter.outputImage {
                outputCI = result
            }
        }

        if let cgImage = context.createCGImage(outputCI, from: outputCI.extent) {
            return NSImage(cgImage: cgImage, size: image.size)
        }
        return image
    }

    private func downsampleAndCompress(image: NSImage, maxPixelSize: CGFloat, quality: CGFloat) -> String? {
        guard let tiff = image.tiffRepresentation,
              let source = CGImageSourceCreateWithData(tiff as CFData, nil) else {
            return nil
        }

        let options: [CFString: Any] = [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceShouldCacheImmediately: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
            kCGImageSourceThumbnailMaxPixelSize: maxPixelSize
        ]

        guard let thumbCG = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else {
            return nil
        }

        let thumbImage = NSImage(cgImage: thumbCG, size: NSSize(width: thumbCG.width, height: thumbCG.height))
        guard let thumbTiff = thumbImage.tiffRepresentation,
              let rep = NSBitmapImageRep(data: thumbTiff),
              let jpeg = rep.representation(using: .jpeg, properties: [.compressionFactor: quality]) else {
            return nil
        }

        let base64 = jpeg.base64EncodedString()
        return "data:image/jpeg;base64,\(base64)"
    }
}
