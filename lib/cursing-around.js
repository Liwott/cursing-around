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
      'cursing-around-screen:move-cursors-down': () => this.screen.moveCursors(this.screen.positionDown),
      'cursing-around-screen:move-cursors-left': () => this.screen.moveCursors(this.screen.positionLeft),
      'cursing-around-screen:move-cursors-right': () => this.screen.moveCursors(this.screen.positionRight),
      'cursing-around-screen:move-last-cursor-up': () => this.screen.moveLastCursor(this.screen.positionUp),
      'cursing-around-screen:move-last-cursor-down': () => this.screen.moveLastCursor(this.screen.positionDown),
      'cursing-around-screen:move-last-cursor-left': () => this.screen.moveLastCursor(this.screen.positionLeft),
      'cursing-around-screen:move-last-cursor-right': () => this.screen.moveLastCursor(this.screen.positionRight),
      'cursing-around-screen:add-cursor-up': () => this.screen.addCursor(this.screen.positionUp),
      'cursing-around-screen:add-cursor-down': () => this.screen.addCursor(this.screen.positionDown),
      'cursing-around-screen:add-cursor-left': () => this.screen.addCursor(this.screen.positionLeft),
      'cursing-around-screen:add-cursor-right': () => this.screen.addCursor(this.screen.positionRight),
      'cursing-around-buffer:move-cursors-up': () => this.buffer.moveCursors(this.buffer.positionUp),
      'cursing-around-buffer:move-cursors-down': () => this.buffer.moveCursors(this.buffer.positionDown),
      'cursing-around-buffer:move-cursors-left': () => this.buffer.moveCursors(this.buffer.positionLeft),
      'cursing-around-buffer:move-cursors-right': () => this.buffer.moveCursors(this.buffer.positionRight),
      'cursing-around-buffer:move-last-cursor-up': () => this.buffer.moveLastCursor(this.buffer.positionUp),
      'cursing-around-buffer:move-last-cursor-down': () => this.buffer.moveLastCursor(this.buffer.positionDown),
      'cursing-around-buffer:move-last-cursor-left': () => this.buffer.moveLastCursor(this.buffer.positionLeft),
      'cursing-around-buffer:move-last-cursor-right': () => this.buffer.moveLastCursor(this.buffer.positionRight),
      'cursing-around-buffer:add-cursor-up': () => this.buffer.addCursor(this.buffer.positionUp),
      'cursing-around-buffer:add-cursor-down': () => this.buffer.addCursor(this.buffer.positionDown),
      'cursing-around-buffer:add-cursor-left': () => this.buffer.addCursor(this.buffer.positionLeft),
      'cursing-around-buffer:add-cursor-right': () => this.buffer.addCursor(this.buffer.positionRight)
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
    },
    
    positionDown(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
      let row, column;
      const range = cursor.marker.getScreenRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        ({ row, column } = range.end);
      } else {
        ({ row, column } = cursor.getScreenPosition());
      }
      if (cursor.goalColumn != null) column = cursor.goalColumn;
      return Point(row + rowCount, column)
    },
    
    positionLeft(cursor,columnCount = 1, { moveToEndOfSelection } = {}) {
      const range = cursor.marker.getScreenRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        cursor.setScreenPosition(range.start);
      } else {
        let { row, column } = cursor.getScreenPosition();
        while (columnCount > column && row > 0) {
          columnCount -= column;
          column = cursor.editor.lineLengthForScreenRow(--row);
          columnCount--; // subtract 1 for the row move
        }
        return Point(row,column - columnCount)
      }
    },
    
    positionRight(cursor,columnCount = 1, { moveToEndOfSelection } = {}) {
      const range = cursor.marker.getScreenRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        cursor.setScreenPosition(range.end);
      } else {
        let { row, column } = cursor.getScreenPosition();
        const maxLines = cursor.editor.getScreenLineCount();
        let rowLength = cursor.editor.lineLengthForScreenRow(row);
        let columnsRemainingInLine = rowLength - column;
        while (columnCount > columnsRemainingInLine && row < maxLines - 1) {
          columnCount -= columnsRemainingInLine;
          columnCount--; // subtract 1 for the row move

          column = 0;
          rowLength = cursor.editor.lineLengthForScreenRow(++row);
          columnsRemainingInLine = rowLength;
        }
        return Point(row,column + columnCount)
      }
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
    },
    
    positionDown(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
      let row, column;
      const range = cursor.marker.getBufferRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        ({ row, column } = range.end);
      } else {
        ({ row, column } = cursor.getBufferPosition());
      }
      if (cursor.goalColumn != null) column = cursor.goalColumn;
      return Point(row + rowCount, column)
    },
    
    positionLeft(cursor,columnCount = 1, { moveToEndOfSelection } = {}) {
      const range = cursor.marker.getBufferRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        cursor.setBufferPosition(range.start);
      } else {
        let { row, column } = cursor.getBufferPosition();
        while (columnCount > column && row > 0) {
          columnCount -= column;
          column = cursor.editor.lineLengthForBufferRow(--row);
          columnCount--; // subtract 1 for the row move
        }
        return Point(row,column - columnCount)
      }
    },
    
    positionRight(cursor,columnCount = 1, { moveToEndOfSelection } = {}) {
      const range = cursor.marker.getBufferRange();
      if (moveToEndOfSelection && !range.isEmpty()) {
        cursor.setBufferPosition(range.end);
      } else {
        let { row, column } = cursor.getBufferPosition();
        const maxLines = cursor.editor.getLineCount();
        let rowLength = cursor.editor.buffer.lineLengthForRow(row);
        let columnsRemainingInLine = rowLength - column;
        while (columnCount > columnsRemainingInLine && row < maxLines - 1) {
          columnCount -= columnsRemainingInLine;
          columnCount--; // subtract 1 for the row move

          column = 0;
          rowLength = cursor.editor.buffer.lineLengthForRow(++row);
          columnsRemainingInLine = rowLength;
        }
        return Point(row,column + columnCount)
      }
    }
  }

};
