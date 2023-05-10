var buttonClick = (object) => {
  let nextElem = object.parentElement.nextElementSibling;

  while (nextElem && !nextElem.classList.contains("powerAutomateCode")) {
    nextElem = nextElem.nextElementSibling;
  }

  if (nextElem) {
    console.log("Found next element with class 'code':", nextElem);
    var tempTextarea = document.createElement("textarea");
    tempTextarea.value = nextElem.innerText;
    console.log(nextElem.innerText)
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);

  } else {
    console.log("No next element with class 'code' found.");
  }
};