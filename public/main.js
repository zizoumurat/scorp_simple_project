// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();

var gifArray = new Array();
var messageArray = new Array();


const isOldMessage = event => {
  return (new Date().getTime() - event.timestamp.getTime()) / 1000 > 20;
}

const isEmptyArray = arr => {
  return arr.length === 0;
}

const isGifType = type => {
  if(type === API_EVENT_TYPE.ANIMATED_GIFT) {
  }
  return type === API_EVENT_TYPE.ANIMATED_GIFT;
}

setInterval(function () {
  if (!isEmptyArray(gifArray) && !isAnimatingGiftUI()) {
    let event = gifArray.shift();
    addMessage(event);
    animateGift(event);
  }

  if (!isEmptyArray(messageArray)) {
    let event = messageArray.shift();
    if (!isOldMessage(event)) {
      addMessage(event);
    }
  }
}, 500);

api.setEventHandler((events) => {
  events.map(event => {
    isGifType(event.type) ? gifArray.push(event) : messageArray.push(event);
  });
})

// NOTE: UI helper methods from `dom_updates` are already imported above.