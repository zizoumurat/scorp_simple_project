// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper();
var queue = new Array();
const EVENT_DELAY = 500;
const OLDER_THAN_MILLISECONDS = 20 * 1000;


function removeEventsFromQueueOlderThan() {
  queue = queue.filter(event => Date.now() - event.timestamp < OLDER_THAN_MILLISECONDS);
}

const isEmptyArray = arr => {
  return arr.length === 0;
}

const isAnimatedGifType = type => {
  return type === API_EVENT_TYPE.ANIMATED_GIFT;
}

setInterval(function () {
  if (!isEmptyArray(queue)) {
    removeEventsFromQueueOlderThan();
    let eventIndex = 0;

    let event = queue[eventIndex];

    if (isAnimatedGifType(event.type)) {
      if (!isAnimatingGiftUI()) {
        addMessage(event);
        animateGift(event);
        queue.splice(eventIndex,1);

        return;
      }

      // 

      eventIndex = queue.findIndex(event => !isAnimatedGifType(event.type));
      
      if (eventIndex === -1) {
          return;
      }

      event = queue[eventIndex];
    }

    addMessage(event);
    queue.splice(eventIndex,1);
  }

}, EVENT_DELAY);

api.setEventHandler((events) => {
  // animatedGiftler kuyruğa öncelikli olarak eklenir, diğer türler geldikleri sıra ile kuyruğa eklenir.
  queue.push(...[...events.filter(event => isAnimatedGifType(event.type)), ...events.filter(event => !isAnimatedGifType(event.type))])
})

// NOTE: UI helper methods from `dom_updates` are already imported above.