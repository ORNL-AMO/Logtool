import {NgxIndexedDB} from 'ngx-indexed-db';

export class Graph {
  constructor(public id: Number, public assessmentId: Number, public displayName: String, public graph: any,
              public visualizeMode: boolean) {
  }

  insertIntoGraphStore(graph: Graph) {
    const db = new NgxIndexedDB('LOGGER', 1);
    db.openDatabase(1, evt => {
    }).then(() => {
      db.add('graph',
        {
          id: graph.id,
          displayName: graph.displayName,
          graph: graph.graph,
          visualizeMode: graph.visualizeMode
        }).then(() => {
        },
        error => {
          alert('File already Imported');
        });
    }, error => {
      console.log(error);
    });
  }

  viewGraphStore() {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getAll('graph').then(graph => {
            resolve(graph);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  viewSelectedGraph(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
          db.getByIndex('graph', 'id', id).then(graph => {
            resolve(graph);
          });
        },
        error => {
          console.log(error);
        });
    });
  }

  deleteFromGraphStore(id) {
    return new Promise(resolve => {
      const db = new NgxIndexedDB('LOGGER', 1);
      db.openDatabase(1, evt => {
      }).then(() => {
        db.delete('graph', id).then(() => {
            console.log('Deleted');
          },
          error => {
            console.log(error);
          });
      });
    });
  }
}
