const mouseEvent = document.querySelector(".select");
const rowSize = document.querySelector(".row-select");
const columnSize = document.querySelector(".column-select");
var eventTriggerCount = document.querySelector(".event-trigger-count");

const submitInput = document.querySelector("input");
submitInput.addEventListener("click", (e) => {
  var container = document.querySelector(".grid-container");
  if (container != null) container.remove();
  var triggerCount = 0;
  eventTriggerCount.textContent = `${triggerCount}`;
  gridMaker(
    rowSize.value,
    columnSize.value,
    400,
    400,
    mouseEvent.value,
    triggerCount
  );
});

function gridMaker(rows, columns, sWidth, sHeight, event, triggerCount) {
  var gridContainer = document.createElement("div");
  gridContainer.className = "grid-container";
  gridContainer.style.width = `${sWidth}px`;
  gridContainer.style.height = `${sHeight}px`;

  var cellWidth = sWidth / columns;
  var cellHeight = sHeight / rows;

  for (i = 0; i < rows; i++) {
    var cellContainer = document.createElement("div");
    cellContainer.className = "cell-container";
    cellContainer.style.height = `${cellHeight}px`;
    cellContainer.style.width = "100%";
    gridContainer.append(cellContainer);
    for (k = 0; k < columns; k++) {
      var cell = document.createElement("div");
      cell.className = "cell";
      cell.style.width = `${cellWidth}px`;
      cell.style.height = `${cellHeight}px`;
      cell.style.backgroundColor = "#f4f4f4";
      var smallCell = document.createElement("div");
      smallCell.className = "smallCell";
      smallCell.style.width = `${cellWidth / 2}px`;
      smallCell.style.height = `${cellHeight / 2}px`;
      smallCell.style.backgroundColor = "#555";
      cellContainer.append(cell);
      cell.append(smallCell);

      cell.addEventListener(event, (e) => {
        e.target.style.backgroundColor = "rgb(230,40,40)";
        triggerCount = triggerCount + 1;
        eventTriggerCount.textContent = `${triggerCount}`;
      });
      cell.addEventListener("transitionend", (e) => {
        e.target.style.backgroundColor = "#f4f4f4";
      });
    }
  }

  //append
  document.body.append(gridContainer);

  //console
  console.dir();
}

