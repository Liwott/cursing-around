'use babel';

import { CompositeDisposable, Point } from 'atom';

export default {
  
  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cursing-around:move-last-cursor-up-in-screen': () => this.moveLastCursorInScreen(this.positionUpInScreen)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },
  
  moveLastCursorInScreen(position) {
    var lastCursor = atom.workspace.getActiveTextEditor().getLastCursor();
    point=position(lastCursor)
    lastCursor.setScreenPosition(point,{ skipSoftWrapIndentation: true });
    lastCursor.goalColumn = point.column;
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
  }

};
