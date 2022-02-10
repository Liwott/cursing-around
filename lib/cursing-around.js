'use babel';

import { CompositeDisposable, Point } from 'atom';

export default {
  
  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cursing-around-screen:move-cursors-up': () => this.screen.moveCursors(this.screen.positionUp),
      'cursing-around-screen:move-last-cursor-up': () => this.screen.moveLastCursor(this.screen.positionUp),
      'cursing-around-screen:add-cursor-up': () => this.screen.addCursor(this.screen.positionUp),
      'cursing-around-buffer:move-cursors-up': () => this.buffer.moveCursors(this.buffer.positionUp),
      'cursing-around-buffer:move-last-cursor-up': () => this.buffer.moveLastCursor(this.buffer.positionUp),
      'cursing-around-buffer:add-cursor-up': () => this.buffer.addCursor(this.buffer.positionUp)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },
  
  screen:{
    moveLastCursor(nextPosition) {
      var lastCursor = atom.workspace.getActiveTextEditor().getLastCursor();
      point=nextPosition(lastCursor);
      lastCursor.setScreenPosition(point,{ skipSoftWrapIndentation: true });
      lastCursor.goalColumn = point.column;
    },
    
    moveCursors(nextPosition) {
      for (var cursor of atom.workspace.getActiveTextEditor().getCursors()) {
        point=nextPosition(cursor);
        cursor.setScreenPosition(point,{ skipSoftWrapIndentation: true });
        cursor.goalColumn = point.column;
      }
    },
    
    addCursor(nextPosition) {
      var editor = atom.workspace.getActiveTextEditor();
      var lastCursor = editor.getLastCursor();
      point=nextPosition(lastCursor);
      newCursor=editor.addCursorAtScreenPosition(point);
      newCursor.goalColumn = point.column;
    },
    
    positionUp(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
      let row, column;
      const range = cursor.marker.getScreenRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        ({ row, column } = range.start);
      } else {
        ({ row, column } = cursor.getScreenPosition());
      }
      if (cursor.goalColumn != null) column = cursor.goalColumn;
      return Point(row - rowCount, column)
    }
  },
  
  buffer:{
    moveLastCursor(nextPosition) {
      var lastCursor = atom.workspace.getActiveTextEditor().getLastCursor();
      point=nextPosition(lastCursor);
      lastCursor.setBufferPosition(point,{ skipSoftWrapIndentation: true });
      lastCursor.goalColumn = point.column;
    },
    
    moveCursors(nextPosition) {
      for (var cursor of atom.workspace.getActiveTextEditor().getCursors()) {
        point=nextPosition(cursor);
        cursor.setBufferPosition(point,{ skipSoftWrapIndentation: true });
        cursor.goalColumn = point.column;
      }
    },
    
    addCursor(nextPosition) {
      var editor = atom.workspace.getActiveTextEditor();
      var lastCursor = editor.getLastCursor();
      point=nextPosition(lastCursor);
      newCursor=editor.addCursorAtBufferPosition(point);
      newCursor.goalColumn = point.column;
    },
    
    positionUp(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
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
  }

};
