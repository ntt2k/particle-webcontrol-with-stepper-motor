// This #include statement was automatically added by the Particle IDE.
#include "PhoBot/PhoBot.h"

int period = 5;
int full_open = 420;
int previousPos = 0;
int currentPos = 0;
int deltaPos = 0;

int detectON = 0 ;
// double temp = 0;
PhoBot p = PhoBot(9.0, 9.0);



void reverse(int numSteps, int period) {
    for (int i = 0; i < numSteps; i++) {
        p.setMotors("M3-F-100");
        p.setMotors("M4-B-100");
        delay(period);
        p.setMotors("M3-F-100");
        p.setMotors("M4-F-100");
        delay(period);
        p.setMotors("M3-B-50");
        p.setMotors("M4-F-50");
        delay(period);
        p.setMotors("M3-B-50");
        p.setMotors("M4-B-50");
        delay(period);
    }
}

void forward(int numSteps, int period) {
    for (int i = 0; i < numSteps; i++) {
        p.setMotors("M3-B-100");
        p.setMotors("M4-B-100");
        delay(period);
        p.setMotors("M3-B-100");
        p.setMotors("M4-F-100");
        delay(period);
        p.setMotors("M3-F-50");
        p.setMotors("M4-F-50");
        delay(period);
        p.setMotors("M3-F-50");
        p.setMotors("M4-B-50");
        delay(period);
    }
}

int controlToggle(String command) {

    if (command == "on") {
        detectON = 1;
        // temp = 40;
        return 1;
    }
    else if (command == "off") {
        detectON = 0;
        // temp = 0;
        return 0;
    }
    else {
        return -1;
    }
}

int controlOpen(String newPosition) {
    if (detectON == 1) {
        currentPos = newPosition.toInt();
        return 1;
    }

    return 0;
}


void setup() {

  Particle.variable("detectON", &detectON, INT);
//   Particle.variable("temp", &temp, DOUBLE);
  Particle.variable("previousPos", &previousPos, INT);
  Particle.variable("currentPos", &currentPos, INT);
  Particle.variable("deltaPos", &deltaPos, INT);

  Particle.function("control",controlToggle);
  Particle.function("controlOpen", controlOpen);
}



void stopit(){

    digitalWrite(D3,LOW);
    digitalWrite(A4,LOW);
    digitalWrite(A5,LOW);
    digitalWrite(D2,LOW);
    digitalWrite(A1,LOW);
    digitalWrite(A0,LOW);


}

void loop() {

  if(detectON == 1){

    if (currentPos > previousPos) {
        deltaPos = currentPos - previousPos;
        forward((deltaPos * full_open) / 100, period);
        previousPos = currentPos;
        // temp += 20;
        stopit();
    }
    else if (currentPos < previousPos) {
        deltaPos = previousPos - currentPos;
        reverse((deltaPos * full_open) / 100, period);
        previousPos = currentPos;
        // temp -= 20;
        stopit();
    }
  }

  // Closing the water before turn off controller
  else {
      if (currentPos > 0) {
        deltaPos = previousPos;
        reverse((deltaPos * full_open) / 100, period);
        reverse(10 , period);

        // reset all variables
        previousPos = 0;
        currentPos = 0;
        deltaPos = 0;
        // temp -= 20;
        stopit();
    }
  }

  stopit();

}
