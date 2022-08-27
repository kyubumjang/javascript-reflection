// copilot
// 원리, 타이머로 이벤트를 지연시키다가 이벤트가 발생하기전에 또 같은 이벤트가 들어오면 전 이벤트를 취소하고
// 타이머를 걸고 하는 것의 반복
export default function debounce(fn, delay) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
