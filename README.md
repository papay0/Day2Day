# Day2Day

![](Images/Demo_Day2Day_full.png)

## What is Day2Day?

Day2Day is a task manager operating on Google Docs.
It's simple and it just works.


## How does Day2Day work?

Every day you write your tasks on a Google Docs the same way you see on the screenshot.

In order to mark the task as done, you only have to strikethrough your task. (Cmd + shift + x on Mac or Alt + Shift + 5 on Windows/Linux)

The script will be run automatically every weekday between midnight and 1am, will copy the uncompleted tasks from the previous day.

## Setup

## Motivation && Previous work

I am using the Google Docs for daily tasks for a few years now but I always found it too much to copy paste the previous day, to remove the completed tasks, every single day. (Yes, I like automation!)

So I wrote a React webapp to do this job for me, the code is available [here](https://github.com/papay0/day-to-day).
But after a while it became too complex for the simple task manager I needed.

## Improvement

- [ ] When all subtasks are done ✅, treat the master task as done ✅.
- [ ] See if Day2Day can be a Docs Add-on.
- [ ] Create a **backlog** category

