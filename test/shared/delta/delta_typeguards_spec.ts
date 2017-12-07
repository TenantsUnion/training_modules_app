import {expect} from 'chai';
import {isDeltaObj} from '../../../shared/delta/typeguards_delta';
import * as Delta from 'quill-delta';

describe('Delta typeguard functions', () => {
   it('should evaluate DeltaStatic object as not a DeltaObj type', function() {
      expect(isDeltaObj(new Delta().insert('a'))).to.be.false;
   });

   it('should evaluate DeltaObj object as type DeltaObj', function() {
      expect(isDeltaObj({
          a: 'text a',
          b: 'text b',
          c: new Delta().insert('text c')
      })).to.be.true;
   });
});