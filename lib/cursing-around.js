'use babel';

import { CompositeDisposable } from 'atom';

export default {
  
  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cursing-around:move-last-cursor-up-in-screen': () => this.moveLastCursor(this.moveUp)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },
  
  moveLastCursor(fn) {
    var lastCursor = atom.workspace.getActiveTextEditor().getLastCursor();
    fn(lastCursor)
  },
  
  moveUp(cursor,rowCount = 1, { moveToEndOfSelection } = {}) {
    let row, column;
    const range = cursor.marker.getScreenRange();
    if (moveToEndOfSelection && !range.isEmpty()) {
      ({ row, column } = range.start);
    } else {
      ({ row, column } = cursor.getScreenPosition());
    }

    if (cursor.goalColumn != null) column = cursor.goalColumn;
    cursor.setScreenPosition(
      { row: row - rowCount, column },
      { skipSoftWrapIndentation: true }
    );
    cursor.goalColumn = column;
  }

};
