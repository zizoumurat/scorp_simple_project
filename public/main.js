// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();
var queue = new Array();
const EVENT_DELAY = 500;


const isOldMessage = event => {
  return (new Date().getTime() - event.timestamp.getTime()) / 1000 > 20;
}

const isEmptyArray = arr => {
  return arr.length === 0;
}

const isAnimatedGifType = type => {
  return type === API_EVENT_TYPE.ANIMATED_GIFT;
}

const isMessageType = type => {
  return type === API_EVENT_TYPE.MESSAGE;
}

const isGifType = type => {
  return type === API_EVENT_TYPE.GIFT;
}

setInterval(function () {
  if (!isEmptyArray(queue)) {
    let event = queue[0];

    if (isAnimatedGifType(event.type) && !isAnimatingGiftUI()) {
      animateGift(event);
      queue.shift();
    }

    if (isMessageType(event.type)) {
      if (!isOldMessage(event)) {
        addMessage(event);
      }

      queue.shift();
    }

    if (isGifType(event.type)) {
      addMessage(event);
      queue.shift();
    }
  }

}, EVENT_DELAY);

api.setEventHandler((events) => {
  queue.push(...[...events.filter(event => isGifType(event.type)), ...events.filter(event => !isGifType(event.type))])
})

// NOTE: UI helper methods from `dom_updates` are already imported above.