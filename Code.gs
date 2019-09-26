function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Init Day2Day", "run")
    .addToUi();
}

// I know that this is not localized, but
// new Date().toLocaleDateString('', {  weekday: 'long' });
// is not returning the expected result.
function getToday() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var date = new Date();
  var dayIndex = date.getDay();
  var dayString = days[dayIndex];
  return dayString + " " + date.toLocaleDateString();
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
  return { first: indexFirstHeading, second: indexSecondHeading };
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
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  var numberOfInsert = 0;
  for (var i = secondHeadingIndex; i > firstHeadingIndex; i--) {
    var child = body.getChild(i + numberOfInsert);
    if (child.getType() == DocumentApp.ElementType.LIST_ITEM) {
      var listItem = child.asListItem().copy();
      var attributes = listItem.getAttributes();
      var isTaskCompleted = attributes.STRIKETHROUGH != null;
      if (numberOfInsert == 0) {
        body.insertParagraph(firstHeadingIndex + 1, "");
        if (listItem.getText() !== "") {
          var emptyBulletPoint = body.insertListItem(firstHeadingIndex + 1, "");
          emptyBulletPoint.setGlyphType(DocumentApp.GlyphType.BULLET);
          numberOfInsert += 1;
        }
        numberOfInsert += 1;
      }
      if (!isTaskCompleted) {
        body.insertListItem(firstHeadingIndex + 1, listItem);
        numberOfInsert += 1;
      }
    }
  }
}

function replaceDateByLabels() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paragraphs = body.getParagraphs();
  var yesterdayIsReplaced = false;
  var todayIsReplaced = false;
  for (var i = 0; i < paragraphs.length; i++) {
    var paragraph = paragraphs[i];
    if (paragraph.getHeading() == DocumentApp.ParagraphHeading.HEADING1) {
      var today = getToday();
      var todayString = " - Today";
      if (paragraph.getText().indexOf(todayString) > -1) {
        paragraph.replaceText("- Today", "");
        yesterdayIsReplaced = true;
      }
      if (paragraph.getText() == today) {
        paragraph.replaceText(today, today + todayString);
        todayIsReplaced = true;
      }
    }
    if (yesterdayIsReplaced == true && todayIsReplaced == true) {
      break;
    }
  }
}

function initDoc() {
  var body = DocumentApp.getActiveDocument().getBody();
  var paragraphs = body.getParagraphs();
  var title = body.getChild(0).asParagraph();
  var brandingTitle = "Day2Day";
  if (title.getText() != brandingTitle) {
    var newTitle = body.insertParagraph(0, brandingTitle);
    newTitle.setHeading(DocumentApp.ParagraphHeading.TITLE);
    newTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  }
}

function shouldRun() {
  var day = new Date().getDay();
  return day != 6 && day != 0;
}

function cron() {
  if (shouldRun()) {
    run();
  }
}

function run() {
  initDoc();
  copyTasks();
  replaceDateByLabels();
}
