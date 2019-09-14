function onOpen() {
  DocumentApp.getUi()
  .createAddonMenu()
  .addItem("Init Day2Day", "run")
  .addToUi();
}

function getToday() {
  return new Date().toLocaleDateString();
}

function getHeadingIndexes() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paragraphs = body.getParagraphs();
  var indexFirstHeading = undefined;
  var indexSecondHeading = undefined;
  for (var i = 0; i < paragraphs.length; i++) {
    var paragraph = paragraphs[i].copy();
    if (paragraph.getHeading() == DocumentApp.ParagraphHeading.HEADING1) {
      if (indexFirstHeading == undefined) {
        indexFirstHeading = i;
        continue;
      }
      if (indexSecondHeading == undefined) {
        indexSecondHeading = i;
      }
    }
  }
  return {"first": indexFirstHeading, "second": indexSecondHeading};
}

function copyTasks() {
  var headingIndexes = getHeadingIndexes();
  var firstHeadingIndex = headingIndexes.first;
  var secondHeadingIndex = headingIndexes.second;
  var body = DocumentApp.getActiveDocument().getBody();
  if (firstHeadingIndex == null) {
    var heading = body.appendParagraph(getToday());
  } else {
    var heading = body.insertParagraph(firstHeadingIndex, getToday());
  }
  numberOfInsert += 1;
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING1)
  var numberOfInsert = 0;
  for (var i = secondHeadingIndex; i > firstHeadingIndex; i--) {
    var child = body.getChild(i+numberOfInsert);
    if (child.getType() == DocumentApp.ElementType.LIST_ITEM) {
      var listItem = child.asListItem().copy();
      var attributes = listItem.getAttributes();
      var isTaskCompleted = attributes.STRIKETHROUGH != null;
      if (!isTaskCompleted) {
        body.insertListItem(firstHeadingIndex + 1, listItem)
        numberOfInsert += 1;
      }
    }
  }
}

function replaceDateByLabels() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paragraphs = body.getParagraphs();
  for (var i = 0; i < paragraphs.length; i++) {
    var paragraph = paragraphs[i]
    if (paragraph.getHeading() == DocumentApp.ParagraphHeading.HEADING1) {
      var today = getToday();
      var todayString = " - Today"
      if (paragraph.getText().indexOf(todayString) > -1) {
        paragraph.replaceText("- Today", "");
      }
      if (paragraph.getText() == today) {
        paragraph.replaceText(today, today + todayString);
      }
    }
  }
}

function initDoc() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paragraphs = body.getParagraphs();
  var title = body.getChild(0).asParagraph();
  Logger.log(title);
  try{
    body.removeChild(title);
  }catch(e){}
  var newTitle = body.insertParagraph(0, "Day2Day")
  newTitle.setHeading(DocumentApp.ParagraphHeading.TITLE);
  newTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
}

function shouldRun() {
  var day = new Date().getDay();
  return day != 6 && day != 0;
}

function run() {
  if (!shouldRun()) {
    return;
  }

  initDoc();
  copyTasks();
  replaceDateByLabels();
}