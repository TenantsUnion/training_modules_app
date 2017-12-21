import {applyDeltaArrOps, deltaArrayDiff, DeltaArrayOp, DeltaArrDiff} from '../../../../shared/delta/diff_key_array';
import {expect} from "chai";

describe('Key Array type guards', function(){

});
describe('Diff Key Array', function () {
    describe('apply operations', function () {
        describe('insert', function () {
            it('should insert an element', function () {
                let addOp: DeltaArrayOp = {
                    val: 'i',
                    op: 'ADD',
                    index: 2
                };
                let beforeArr = [1, 2, 3];
                let afterArr = [1, 2, 'i', 3];
                expect(applyDeltaArrOps(beforeArr, [addOp])).to.deep.equal(afterArr);
            });

            it('should insert two consecutive elements', function () {
                let addOps: DeltaArrayOp[] = [
                    {
                        val: 'i',
                        op: 'ADD',
                        index: 2
                    },
                    {
                        val: 'j',
                        op: 'ADD',
                        index: 3
                    }
                ];
                let beforeArr = [1, 2, 3];
                let afterArr = [1, 2, 'i', 'j', 3];
                expect(applyDeltaArrOps(beforeArr, addOps)).to.deep.equal(afterArr);
            });

            it('should insert two non consecutive elements', function () {
                let addOps: DeltaArrayOp[] = [
                    {
                        val: 'i',
                        op: 'ADD',
                        index: 2
                    },
                    {
                        val: 'j',
                        op: 'ADD',
                        index: 4
                    }
                ];
                let beforeArr = [1, 2, 3];
                let afterArr = [1, 2, 'i', 3, 'j'];
                expect(applyDeltaArrOps(beforeArr, addOps)).to.deep.equal(afterArr);
            });
        });
        describe('delete', function () {
            it('should delete a single element', function () {
                let deleteOps: DeltaArrayOp[] = [
                    {
                        val: 3,
                        op: 'DELETE',
                        index: 2
                    }
                ];
                let beforeArr = [1, 2, 3, 4];
                let afterArr = [1, 2, 4];
                expect(applyDeltaArrOps(beforeArr, deleteOps)).to.deep.equal(afterArr);
            });

            it('should delete two consecutive elements', function () {
                let deleteOps: DeltaArrayOp[] = [
                    {
                        val: 2,
                        op: 'DELETE',
                        index: 1
                    },
                    {
                        val: 3,
                        op: 'DELETE',
                        index: 1
                    }
                ];
                let beforeArr = [1, 2, 3, 4];
                let afterArr = [1, 4];
                expect(applyDeltaArrOps(beforeArr, deleteOps)).to.deep.equal(afterArr);
            });

            it('should delete two non consecutive elements', function () {
                let deleteOps: DeltaArrayOp[] = [
                    {
                        val: 1,
                        op: 'DELETE',
                        index: 0
                    },
                    {
                        val: 3,
                        op: 'DELETE',
                        index: 1
                    }
                ];
                let beforeArr = [1, 2, 3, 4];
                let afterArr = [2, 4];
                expect(applyDeltaArrOps(beforeArr, deleteOps)).to.deep.equal(afterArr);
            });
        });

        describe('move', function () {
            it('should move a single element', function () {
                let moveOps: DeltaArrayOp[] = [
                    {
                        op: 'MOVE',
                        beforeIndex: 0,
                        index: 3
                    }
                ];
                let beforeArr = [1, 2, 3, 4];
                let afterArr = [2, 3, 4, 1];
                expect(applyDeltaArrOps(beforeArr, moveOps)).to.deep.equal(afterArr);
            });

            it('should move two consecutive elements', function () {
                let moveOps: DeltaArrayOp[] = [
                    {
                        op: 'MOVE',
                        beforeIndex: 1,
                        index: 3
                    },
                    {
                        op: 'MOVE',
                        beforeIndex: 1,
                        index: 3
                    }
                ];
                let beforeArr = [1, 2, 3, 4, 5];
                let afterArr = [1, 4, 2, 3, 5];
                expect(applyDeltaArrOps(beforeArr, moveOps)).to.deep.equal(afterArr);
            });

            it('should swap two elements', function () {
                let moveOps: DeltaArrayOp[] = [
                    {
                        op: 'MOVE',
                        beforeIndex: 1,
                        index: 3
                    },
                    {
                        op: 'MOVE',
                        beforeIndex: 2,
                        index: 1
                    }
                ];
                let beforeArr = [1, 2, 3, 4];
                let afterArr = [1, 4, 3, 2];
                expect(applyDeltaArrOps(beforeArr, moveOps)).to.deep.equal(afterArr);
            });
        });
    });
    describe('determine operations', function () {
        describe('determine insert operations diff', function () {
            it('should determine the diff and operations to add a single key element', function () {
                let beforeArr = [0, 1, 2, 4];
                let afterArr = [0, 1, 2, 3, 4];
                let ops = [
                    {
                        val: 3,
                        index: 3,
                        op: 'ADD'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops)

            });

            it('should determine the diff and operations needed to add two non consecutive elements from the array', function () {
                let beforeArr = [0, 2, 4];
                let afterArr = [0, 1, 2, 3, 4];
                let ops = [
                    {
                        val: 1,
                        index: 1,
                        op: 'ADD'
                    },
                    {
                        val: 3,
                        index: 3,
                        op: 'ADD'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });
            it('should determine the diff and operations needed to add two consecutive keys from the array', function () {
                let beforeArr = [0, 1, 4];
                let afterArr = [0, 1, 2, 3, 4];
                let ops = [
                    {
                        val: 2,
                        index: 2,
                        op: 'ADD'
                    },
                    {
                        val: 3,
                        index: 3,
                        op: 'ADD'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });
        });
        describe('delete operations', function () {
            it('should determine the diff and operations to remove a single key element', function () {
                let beforeArr = [0, 1, 2, 3, 4];
                let afterArr = [0, 1, 2, 4];
                let ops = [
                    {
                        val: 3,
                        index: 3,
                        op: 'DELETE'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops)

            });
            it('should determine the diff and operations needed to remove two non consecutive elements from the array', function () {
                let beforeArr = [0, 1, 2, 3, 4];
                let afterArr = [0, 2, 4];
                let ops = [
                    {
                        val: 1,
                        index: 1,
                        op: 'DELETE'
                    },
                    {
                        val: 3,
                        index: 2,
                        op: 'DELETE'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });
            it('should determine the diff and operations needed to remove two consecutive keys from the array', function () {
                let beforeArr = [0, 1, 2, 3, 4];
                let afterArr = [0, 1, 4];
                let ops = [
                    {
                        val: 2,
                        index: 2,
                        op: 'DELETE'
                    },
                    {
                        val: 3,
                        index: 2,
                        op: 'DELETE'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });
        });
        describe('move operations', function () {
            it('should determine the diff and operations to move a single key element', function () {
                let beforeArr = [0, 1, 2, 3, 4];
                let afterArr = [0, 1, 4, 2, 3];
                let ops = [
                    {
                        beforeIndex: 4,
                        index: 2,
                        op: 'MOVE'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops)

            });
            it('should determine the diff and operations needed to move two non consecutive elements', function () {
                let beforeArr = [0, 1, 2, 3, 4];

                let afterArr = [0, 4, 2, 1, 3];
                // todo log intermediate array
                let ops = [
                    {
                        beforeIndex: 4,
                        index: 1,
                        op: 'MOVE'
                    },
                    {
                        beforeIndex: 3,
                        index: 2,
                        op: 'MOVE'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });
            it('should determine the diff and operations needed to remove two consecutive keys from the array', function () {
                let beforeArr = [0, 1, 2, 3, 4];
                let afterArr = [0, 1, 4];
                let ops = [
                    {
                        val: 2,
                        index: 2,
                        op: 'DELETE'
                    },
                    {
                        val: 3,
                        index: 2,
                        op: 'DELETE'
                    }
                ];
                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });
        });
        describe('multiple operations', function () {
            it('should determine two move operations', function () {
                let ops = [
                    {
                        beforeIndex: 1,
                        index: 0,
                        op: "MOVE",
                    },
                    {
                        beforeIndex: 2,
                        index: 1,
                        op: "MOVE"
                    }
                ];
                expect(deltaArrayDiff([1, 2, 3, 4], [2, 3, 1, 4])).to.deep.equal(ops);
            });

            it('should determine one delete operation, one add operation, and move operations', function(){
                let beforeArr = [1, 2, 3];
                let afterArr = ['add', 3, 2];
                let ops: DeltaArrayOp[] = [
                    {
                        index: 0,
                        val: 1,
                        op: "DELETE"
                    },
                    {
                        index: 0,
                        val: 'add',
                        op: 'ADD'
                    },
                    {
                        beforeIndex: 2,
                        index: 1,
                        op: 'MOVE'
                    }
                ];

                expect(deltaArrayDiff(beforeArr, afterArr)).to.deep.equal(ops);
            });

        })
    });
});
