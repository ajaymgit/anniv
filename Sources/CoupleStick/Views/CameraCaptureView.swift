import SwiftUI
import AppKit
import AVFoundation
import CoreImage

// MARK: - Native Live Camera Preview NSView
public final class LiveCameraPreviewNSView: NSView {
    public let videoPreviewLayer = AVCaptureVideoPreviewLayer()

    public override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        self.wantsLayer = true
        videoPreviewLayer.videoGravity = .resizeAspectFill
        self.layer = videoPreviewLayer
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        self.wantsLayer = true
        videoPreviewLayer.videoGravity = .resizeAspectFill
        self.layer = videoPreviewLayer
    }

    public override func layout() {
        super.layout()
        videoPreviewLayer.frame = self.bounds
        if let connection = videoPreviewLayer.connection, connection.isVideoMirroringSupported {
            connection.automaticallyAdjustsVideoMirroring = false
            connection.isVideoMirrored = false
        }
    }
}

public struct LiveCameraPreviewView: NSViewRepresentable {
    let session: AVCaptureSession

    public init(session: AVCaptureSession) {
        self.session = session
    }

    public func makeNSView(context: Context) -> LiveCameraPreviewNSView {
        let view = LiveCameraPreviewNSView()
        view.videoPreviewLayer.session = session
        if let connection = view.videoPreviewLayer.connection, connection.isVideoMirroringSupported {
            connection.automaticallyAdjustsVideoMirroring = false
            connection.isVideoMirrored = false
        }
        return view
    }

    public func updateNSView(_ nsView: LiveCameraPreviewNSView, context: Context) {
        if nsView.videoPreviewLayer.session != session {
            nsView.videoPreviewLayer.session = session
        }
        if let connection = nsView.videoPreviewLayer.connection, connection.isVideoMirroringSupported {
            connection.automaticallyAdjustsVideoMirroring = false
            connection.isVideoMirrored = false
        }
    }
}

// MARK: - Camera Capture View Model
public final class CameraCaptureViewModel: NSObject, ObservableObject, AVCapturePhotoCaptureDelegate {
    @Published public var isSessionRunning: Bool = false
    @Published public var isCapturing: Bool = false
    @Published public var capturedImage: NSImage? = nil
    @Published public var permissionDenied: Bool = false
    @Published public var nickname: String = "Babe"

    public let captureSession = AVCaptureSession()
    private let photoOutput = AVCapturePhotoOutput()
    private let sessionQueue = DispatchQueue(label: "com.couplestick.cameracapture.queue")
    private var isConfigured = false

    public override init() {
        super.init()
        self.nickname = UserDefaults.standard.string(forKey: "CoupleStick_Nickname") ?? "Babe"
    }

    public func checkPermissionAndStart() {
        let status = AVCaptureDevice.authorizationStatus(for: .video)
        switch status {
        case .authorized:
            self.setupAndStartSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    if granted {
                        self?.setupAndStartSession()
                    } else {
                        self?.permissionDenied = true
                    }
                }
            }
        case .denied, .restricted:
            DispatchQueue.main.async {
                self.permissionDenied = true
            }
        @unknown default:
            break
        }
    }

    private func setupAndStartSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }

            if !self.isConfigured {
                self.captureSession.beginConfiguration()

                if self.captureSession.canSetSessionPreset(.high) {
                    self.captureSession.sessionPreset = .high
                } else if self.captureSession.canSetSessionPreset(.hd1280x720) {
                    self.captureSession.sessionPreset = .hd1280x720
                } else {
                    self.captureSession.sessionPreset = .medium
                }

                guard let camera = AVCaptureDevice.default(for: .video) ??
                                   AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
                    print("[CameraCapture] No camera found.")
                    self.captureSession.commitConfiguration()
                    return
                }

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
                    print("[CameraCapture] Configuration lock failed: \(error)")
                }

                if let input = try? AVCaptureDeviceInput(device: camera), self.captureSession.canAddInput(input) {
                    self.captureSession.addInput(input)
                }

                if self.captureSession.canAddOutput(self.photoOutput) {
                    self.captureSession.addOutput(self.photoOutput)
                }

                if let connection = self.photoOutput.connection(with: .video) {
                    if connection.isVideoMirroringSupported {
                        connection.automaticallyAdjustsVideoMirroring = false
                        connection.isVideoMirrored = false
                    }
                }

                self.captureSession.commitConfiguration()
                self.isConfigured = true
            }

            if !self.captureSession.isRunning {
                self.captureSession.startRunning()
            }

            DispatchQueue.main.async {
                self.isSessionRunning = true
            }
        }
    }

    public func stopSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            if self.captureSession.isRunning {
                self.captureSession.stopRunning()
            }
            DispatchQueue.main.async {
                self.isSessionRunning = false
            }
        }
    }

    public func snapPhoto() {
        guard isSessionRunning, !isCapturing else { return }
        isCapturing = true
        SoundManager.shared.playCameraShutter()

        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            let settings = AVCapturePhotoSettings()
            self.photoOutput.capturePhoto(with: settings, delegate: self)
        }
    }

    public func retake() {
        self.capturedImage = nil
        self.isCapturing = false
        setupAndStartSession()
    }

    public func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        defer {
            DispatchQueue.main.async {
                self.isCapturing = false
            }
        }

        guard error == nil,
              let data = photo.fileDataRepresentation(),
              let rawImage = NSImage(data: data) else {
            return
        }

        let enhanced = enhanceSelfieQuality(image: rawImage)

        DispatchQueue.main.async {
            self.capturedImage = enhanced
            self.stopSession()
        }
    }

    public func sendPhoto(onDone: @escaping () -> Void) {
        guard let img = capturedImage else { return }

        if let tiff = img.tiffRepresentation,
           let rep = NSBitmapImageRep(data: tiff),
           let jpeg = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85]) {
            let base64 = jpeg.base64EncodedString()
            let dataUrl = "data:image/jpeg;base64,\(base64)"
            RealtimeService.shared.sendMedia(dataUrl: dataUrl, isVideo: false, message: "Live selfie! 📸")

            if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: dataUrl, message: "Selfie sent to \(self.nickname)! 📸")
            }
        }

        onDone()
    }

    private func enhanceSelfieQuality(image: NSImage) -> NSImage {
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
}

// MARK: - Camera Capture View (Embedded in Floating Window)
public struct CameraCaptureView: View {
    @StateObject private var viewModel = CameraCaptureViewModel()
    let onDismiss: () -> Void

    public init(onDismiss: @escaping () -> Void) {
        self.onDismiss = onDismiss
    }

    public var body: some View {
        VStack(spacing: 8) {
            // Header with draggable title bar & dismiss
            HStack {
                HStack(spacing: 5) {
                    Image(systemName: "camera.fill")
                        .foregroundColor(.pink)
                        .font(.system(size: 11))
                    Text(viewModel.capturedImage != nil ? "Review Selfie 📸" : "Selfie for \(viewModel.nickname)")
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                }
                Spacer()
                Button(action: {
                    viewModel.stopSession()
                    onDismiss()
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.white.opacity(0.65))
                        .font(.system(size: 14))
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 4)

            // Viewfinder / Captured Photo Screen
            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.black.opacity(0.65))
                    .frame(width: 236, height: 165)

                if let captured = viewModel.capturedImage {
                    Image(nsImage: captured)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 236, height: 165)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                } else if viewModel.permissionDenied {
                    VStack(spacing: 6) {
                        Image(systemName: "camera.badge.ellipsis")
                            .font(.system(size: 24))
                            .foregroundColor(.pink)
                        Text("Camera access denied.\nPlease allow in System Settings.")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                    }
                    .padding(10)
                } else {
                    LiveCameraPreviewView(session: viewModel.captureSession)
                        .frame(width: 236, height: 165)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(Color.white.opacity(0.2), lineWidth: 1)
                        )

                    if !viewModel.isSessionRunning {
                        ProgressView()
                            .scaleEffect(0.7)
                    }
                }
            }

            // Bottom Controls
            if viewModel.capturedImage != nil {
                // Post-Snap: Retake or Send
                HStack(spacing: 10) {
                    Button(action: {
                        viewModel.retake()
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "arrow.counterclockwise")
                            Text("Retake")
                        }
                        .font(.system(size: 12, weight: .semibold, design: .rounded))
                        .foregroundColor(.white.opacity(0.9))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Capsule().fill(Color.white.opacity(0.18)))
                    }
                    .buttonStyle(.plain)

                    Button(action: {
                        viewModel.sendPhoto {
                            onDismiss()
                        }
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "paperplane.fill")
                            Text("Send ❤️")
                        }
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 6)
                        .background(
                            Capsule().fill(
                                LinearGradient(
                                    colors: [.pink, .purple],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                        )
                        .shadow(color: .pink.opacity(0.4), radius: 5, x: 0, y: 2)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.top, 2)
            } else {
                // Live View: Snap Button
                Button(action: {
                    viewModel.snapPhoto()
                }) {
                    ZStack {
                        Circle()
                            .stroke(Color.white.opacity(0.85), lineWidth: 2.5)
                            .frame(width: 42, height: 42)
                        Circle()
                            .fill(Color.pink)
                            .frame(width: 34, height: 34)
                        Image(systemName: "camera.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
                .buttonStyle(.plain)
                .disabled(!viewModel.isSessionRunning || viewModel.isCapturing)
                .opacity(viewModel.isSessionRunning ? 1.0 : 0.5)
                .padding(.top, 2)
            }
        }
        .padding(12)
        .frame(width: 256)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.black.opacity(0.92))
                .background(.ultraThinMaterial)
                .shadow(color: .pink.opacity(0.4), radius: 16, x: 0, y: 5)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(
                    LinearGradient(
                        colors: [.pink.opacity(0.85), .purple.opacity(0.75)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1.6
                )
        )
        .gesture(
            DragGesture(minimumDistance: 3)
                .onChanged { value in
                    if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) as? FloatingPanel<StickerView> {
                        panel.updateDrag(translationX: value.translation.width, translationY: value.translation.height)
                    }
                }
                .onEnded { _ in
                    if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) as? FloatingPanel<StickerView> {
                        panel.endDrag()
                    }
                }
        )
        .onAppear {
            viewModel.checkPermissionAndStart()
        }
        .onDisappear {
            viewModel.stopSession()
        }
    }
}
