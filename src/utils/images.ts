import ldrSensor from "../assets/placeholders/sensor-ldr.svg";
import potentiometerSensor from "../assets/placeholders/sensor-potenciometro.svg";
import ultrasonicSensor from "../assets/placeholders/sensor-ultrassonico.svg";

const imageMap: Record<string, string> = {
  "sensor-ultrassonico": ultrasonicSensor,
  "sensor-ldr": ldrSensor,
  "sensor-potenciometro": potentiometerSensor
};

export function resolveQuestionImage(src: string): string {
  return imageMap[src] ?? src;
}
