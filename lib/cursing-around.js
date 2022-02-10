'use babel';

import { CompositeDisposable, Point } from 'atom';

export default {
  
  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cursing-around-screen:move-cursors-up': () => this.moveCursorsInScreen(this.positionUpInScreen),
      'cursing-around-screen:move-last-cursor-up': () => this.moveLastCursorInScreen(this.positionUpInScreen),
      'cursing-around-screen:add-cursor-up': () => this.addCursorInScreen(this.positionUpInScreen),
      'cursing-around-buffer:move-cursors-up': () => this.moveCursorsInBuffer(this.positionUpInBuffer),
      'cursing-around-buffer:move-last-cursor-up': () => this.moveLastCursorInBuffer(this.positionUpInBuffer),
      'cursing-around-buffer:add-cursor-up': () => this.addCursorInBuffer(this.positionUpInBuffer)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },
  
  moveLastCursorInScreen(nextPosition) {
    var lastCursor = atom.workspace.getActiveTextEditor().getLastCursor();
    point=nextPosition(lastCursor);
    lastCursor.setScreenPosition(point,{ skipSoftWrapIndentation: true });
    lastCursor.goalColumn = point.column;
  },
  
  moveCursorsInScreen(nextPosition) {
    for (var cursor of atom.workspace.getActiveTextEditor().getCursors()) {
      point=nextPosition(cursor);
      cursor.setScreenPosition(point,{ skipSoftWrapIndentation: true });
      cursor.goalColumn = point.column;
    }
  },
  
  addCursorInScreen(nextPosition) {
    var editor = atom.workspace.getActiveTextEditor();
    var lastCursor = editor.getLastCursor();
    point=nextPosition(lastCursor);
    newCursor=editor.addCursorAtScreenPosition(point);
    newCursor.goalColumn = point.column;
  },
  
  positionUpInScreen(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
    let row, column;
    const range = cursor.marker.getScreenRange();
    if (moveToEndOfSelection && !range.isEmpty()) {
      ({ row, column } = range.start);
    } else {
      ({ row, column } = cursor.getScreenPosition());
    }
    if (cursor.goalColumn != null) column = cursor.goalColumn;
    return Point(row - rowCount, column)
  },
  
  moveLastCursorInBuffer(nextPosition) {
    var lastCursor = atom.workspace.getActiveTextEditor().getLastCursor();
    point=nextPosition(lastCursor);
    lastCursor.setBufferPosition(point,{ skipSoftWrapIndentation: true });
    lastCursor.goalColumn = point.column;
  },
  
  moveCursorsInBuffer(nextPosition) {
    for (var cursor of atom.workspace.getActiveTextEditor().getCursors()) {
      point=nextPosition(cursor);
      cursor.setBufferPosition(point,{ skipSoftWrapIndentation: true });
      cursor.goalColumn = point.column;
    }
  },
  
  addCursorInBuffer(nextPosition) {
    var editor = atom.workspace.getActiveTextEditor();
    var lastCursor = editor.getLastCursor();
    point=nextPosition(lastCursor);
    newCursor=editor.addCursorAtBufferPosition(point);
    newCursor.goalColumn = point.column;
  },
  
  positionUpInBuffer(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
    let row, column;
    const range = cursor.marker.getBufferRange();
    if (moveToEndOfSelection && !range.isEmpty()) {
      ({ row, column } = range.start);
    } else {
      ({ row, column } = cursor.getBufferPosition());
    }
    if (cursor.goalColumn != null) column = cursor.goalColumn;
    return Point(row - rowCount, column)
  }

};
