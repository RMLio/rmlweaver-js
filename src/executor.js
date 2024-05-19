import parse from 'dotparser'
import {
  observeOn,
  Subject, map, queueScheduler,
} from 'rxjs'
import { OpManager } from './operator/operatormanager.js'
import { TargetOp } from './operator/targetOperator.js'
import {JoinOperator} from "./operator/joinOperator.js";
import {FragmentOp} from "./operator/fragmentOperator.js";
import {BinaryOperator} from "./operator/binaryOperator.js";


export class Executor {
  constructor (dot) {
    // realizer

    const ast = parse(dot)
    this.opManager = new OpManager()

    ast[0].children.filter(c => c.type === 'node_stmt').forEach(c => {
      const configAll = JSON.parse(c.attr_list[0].eq)
      this.opManager.addOp(configAll.id, configAll.operator.type, configAll.operator.config)
    })

    const channels = []
    ast[0].children.filter(c => c.type === 'edge_stmt').forEach(c => {
      channels.push([
        this.opManager.getOperatorByIndex(c.edge_list[0].id),
        this.opManager.getOperatorByIndex(c.edge_list[1].id)
      ])
    })


    let observables = {};
    let binaryOperators = {};

    this.targetObservables = []; // For piping usage when executing tests.

    channels.forEach(channel => {
      let observable = observables[channel[0].getId()];

      if (observable === undefined) {
        // Fragment operator will be present multiple times, but we need only one observable that is test.
        observable = new Subject();

        if (channel[0] instanceof FragmentOp) {
          channel[0].setPush(v => {
            observable.next({...v});
          });
        } else {
          channel[0].setPush(v => {
            observable.next(v);
          });
        }


        channel[0].setComplete(() => {
          observable.complete();
        });
        if (channel[0] instanceof FragmentOp) {
          observable = observable.pipe(observeOn(queueScheduler), map(v => {
            return {...v}
          })) // Shallow copy data to prevent modification in other subscribers
          observables[channel[0].getId()] = observable;
        } else {
          observable = observable.pipe(observeOn(queueScheduler));
        }
      }
      if (channel[1] instanceof BinaryOperator) {
        const operatorType = channel[1].constructor.name
        if(binaryOperators[operatorType] === undefined){
          binaryOperators[operatorType] = {}
        }
        const firstObservable = binaryOperators[operatorType][channel[1].getId()];

        if (firstObservable === undefined) {
          binaryOperators[operatorType][channel[1].getId()] = observable;
        } else {
          firstObservable.subscribe({
            next: (v) => {
              channel[1].nextLeft(v);
            },
            complete() {
              channel[1].completeLeft();
            }
          });
          observable.subscribe({
            next: (v) => {
              channel[1].nextRight(v);
            },
            complete() {
              channel[1].completeRight();
            }
          });
        }
      } else {
        if(channel[1] instanceof  TargetOp){
          this.targetObservables.push(observable)
        }
        observable.subscribe({
          next: v => {
            channel[1].next(v);
          },
          complete() {
            channel[1].complete();
          }
        });
      }

    });

  }

  async run () {
    // run
    this.opManager.getOperators().forEach(operator => {
      operator.start()
    })
  }
  run_tests(catchOutput = true) {
    return new Promise((resolve, reject) => {
      let results = [];
      let toComplete = 0;

      const onComplete = () => {
        toComplete--;
        if (toComplete === 0) {
          resolve(results);
        }
      };
      if(catchOutput){
        this.targetObservables.forEach(obs => {
          toComplete++;
          obs.pipe().subscribe({
            next: (v) => {
              results.push(v);
            },
            complete: onComplete,
            error: reject, // Propagate errors
          });
        });
      }
      try{ // Catch errors
        this.opManager.getOperators().forEach(operator => {
          operator.start();
        });
      }catch (e) {
        reject(e);
      }
    });
  }
}
