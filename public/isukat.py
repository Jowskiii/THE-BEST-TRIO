import cv2
from inference_sdk import InferenceHTTPClient
import time

# Initialize the Roboflow client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="S2lNTp96u2Bhh6Pazrz9"
)

# Initialize the camera
cap = cv2.VideoCapture(0)  # 0 is usually the default camera

def capture_and_infer():
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    if not ret:
        print("Failed to capture image")
        return
    
    # Save the captured frame as a temporary file
    temp_filename = "temp_capture.jpg"
    cv2.imwrite(temp_filename, frame)
    
    # Perform inference on the captured image
    result = CLIENT.infer(temp_filename, model_id="isukat/1")
    
    # Process and display results
    print("Inference result:", result)
    
    # Draw bounding boxes on the frame (assuming the result contains bounding box information)
    for detection in result.get("predictions", []):
        x, y, w, h = detection.get("x"), detection.get("y"), detection.get("width"), detection.get("height")
        label = detection.get("class")
        confidence = detection.get("confidence")
        
        # Convert normalized coordinates to pixel coordinates
        height, width = frame.shape[:2]
        x1, y1 = int((x - w/2) * width), int((y - h/2) * height)
        x2, y2 = int((x + w/2) * width), int((y + h/2) * height)
        
        # Draw bounding box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        # Add label and confidence
        label_text = f"{label}: {confidence:.2f}"
        cv2.putText(frame, label_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    # Display the resulting frame
    cv2.imshow('Object Detection', frame)

# Main loop
while True:
    capture_and_infer()
    
    # Break the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    
    # Add a small delay to control the inference rate
    time.sleep(0.1)

# When everything is done, release the capture and close windows
cap.release()
cv2.destroyAllWindows()