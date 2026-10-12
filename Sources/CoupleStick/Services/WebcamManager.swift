import Foundation
import AppKit
import AVFoundation
import CoreImage

public final class WebcamManager: NSObject, AVCapturePhotoCaptureDelegate {
    public static let shared = WebcamManager()

    private var captureSession: AVCaptureSession?
    private var photoOutput: AVCapturePhotoOutput?
    private var completionHandler: ((NSImage?) -> Void)?
    private let sessionQueue = DispatchQueue(label: "com.couplestick.webcam.queue")

    private override init() {
        super.init()
    }

    public func captureSelfie(completion: @escaping (NSImage?) -> Void) {
        let authStatus = AVCaptureDevice.authorizationStatus(for: .video)
        switch authStatus {
        case .authorized:
            self.executeCapture(completion: completion)
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                DispatchQueue.main.async {
                    if granted {
                        self.executeCapture(completion: completion)
                    } else {
                        print("[WebcamManager] Camera permission denied by user.")
                        completion(nil)
                    }
                }
            }
        case .denied, .restricted:
            print("[WebcamManager] Camera access restricted or denied.")
            completion(nil)
        @unknown default:
            completion(nil)
        }
    }

    private func executeCapture(completion: @escaping (NSImage?) -> Void) {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }

            guard let camera = AVCaptureDevice.default(for: .video) ??
                               AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
                print("[WebcamManager] No camera hardware device found.")
                DispatchQueue.main.async { completion(nil) }
                return
            }

            do {
                let session = AVCaptureSession()
                if session.canSetSessionPreset(.high) {
                    session.sessionPreset = .high
                } else if session.canSetSessionPreset(.hd1920x1080) {
                    session.sessionPreset = .hd1920x1080
                } else if session.canSetSessionPreset(.hd1280x720) {
                    session.sessionPreset = .hd1280x720
                } else if session.canSetSessionPreset(.photo) {
                    session.sessionPreset = .photo
                } else {
                    session.sessionPreset = .medium
                }

                // Configure hardware auto-exposure, white balance, and autofocus
                do {
                    try camera.lockForConfiguration()
                    if camera.isExposureModeSupported(.continuousAutoExposure) {
                        camera.exposureMode = .continuousAutoExposure
                    }
                    if camera.isWhiteBalanceModeSupported(.continuousAutoWhiteBalance) {
                        camera.whiteBalanceMode = .continuousAutoWhiteBalance
                    }
                    if camera.isFocusModeSupported(.continuousAutoFocus) {
                        camera.focusMode = .continuousAutoFocus
                    }
                    camera.unlockForConfiguration()
                } catch {
                    print("[WebcamManager] Could not lock camera for configuration: \(error)")
                }

                let input = try AVCaptureDeviceInput(device: camera)
                if session.canAddInput(input) {
                    session.addInput(input)
                } else {
                    DispatchQueue.main.async { completion(nil) }
                    return
                }

                let output = AVCapturePhotoOutput()
                if session.canAddOutput(output) {
                    session.addOutput(output)
                } else {
                    DispatchQueue.main.async { completion(nil) }
                    return
                }

                if let connection = output.connection(with: .video) {
                    if connection.isVideoMirroringSupported {
                        connection.automaticallyAdjustsVideoMirroring = false
                        connection.isVideoMirrored = false
                    }
                }

                self.captureSession = session
                self.photoOutput = output
                self.completionHandler = completion

                session.startRunning()

                // Allow 0.95s for camera hardware AE/AWB to meter lighting and converge
                DispatchQueue.global().asyncAfter(deadline: .now() + 0.95) {
                    let settings = AVCapturePhotoSettings()
                    output.capturePhoto(with: settings, delegate: self)
                }
            } catch {
                print("[WebcamManager] Failed to initialize camera session: \(error.localizedDescription)")
                DispatchQueue.main.async { completion(nil) }
            }
        }
    }

    public func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        sessionQueue.async { [weak self] in
            self?.captureSession?.stopRunning()
            self?.captureSession = nil
            self?.photoOutput = nil
        }

        if let error = error {
            print("[WebcamManager] Capture photo error: \(error.localizedDescription)")
            DispatchQueue.main.async {
                self.completionHandler?(nil)
                self.completionHandler = nil
            }
            return
        }

        guard let data = photo.fileDataRepresentation(),
              let rawImage = NSImage(data: data) else {
            DispatchQueue.main.async {
                self.completionHandler?(nil)
                self.completionHandler = nil
            }
            return
        }

        // Apply computational photography enhancement (exposure compensation, shadow lift, auto tone curve, skin vibrance)
        let enhancedImage = enhanceSelfieQuality(image: rawImage)

        DispatchQueue.main.async {
            self.completionHandler?(enhancedImage)
            self.completionHandler = nil
        }
    }

    private func enhanceSelfieQuality(image: NSImage) -> NSImage {
        guard let tiffData = image.tiffRepresentation,
              let ciImage = CIImage(data: tiffData) else {
            return image
        }

        let context = CIContext(options: [.useSoftwareRenderer: false])
        var outputCI = ciImage

        // 1. Calculate average scene luminance
        let extentVector = CIVector(x: ciImage.extent.origin.x, y: ciImage.extent.origin.y, z: ciImage.extent.size.width, w: ciImage.extent.size.height)
        var avgLuminance = 0.5
        if let filter = CIFilter(name: "CIAreaAverage", parameters: [kCIInputImageKey: ciImage, kCIInputExtentKey: extentVector]),
           let avgImage = filter.outputImage {
            var bitmap = [UInt8](repeating: 0, count: 4)
            context.render(avgImage, toBitmap: &bitmap, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1), format: .RGBA8, colorSpace: nil)
            avgLuminance = (0.299 * Double(bitmap[0]) + 0.587 * Double(bitmap[1]) + 0.114 * Double(bitmap[2])) / 255.0
        }

        // 2. Photographic exposure adjustment (scales light linearly, maintaining deep contrast without foggy haze)
        if avgLuminance < 0.48 {
            let evBoost = min(1.0, (0.50 - avgLuminance) * 2.0)
            if let expFilter = CIFilter(name: "CIExposureAdjust") {
                expFilter.setValue(outputCI, forKey: kCIInputImageKey)
                expFilter.setValue(evBoost, forKey: kCIInputEVKey)
                if let result = expFilter.outputImage {
                    outputCI = result
                }
            }

            // Lift shadows to illuminate faces and eyes in dim lighting
            if let shadowFilter = CIFilter(name: "CIHighlightShadowAdjust") {
                shadowFilter.setValue(outputCI, forKey: kCIInputImageKey)
                shadowFilter.setValue(1.25, forKey: "inputShadowAmount")
                if let result = shadowFilter.outputImage {
                    outputCI = result
                }
            }
        }

        // 3. Apple Auto-Adjustment Filters (tone curve & white balance)
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

        // 4. Subtle skin vibrance & warmth
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
}
