import {expect} from 'chai';
import {isDeltaObj} from '@shared/delta/typeguards_delta';
import {Delta} from '@shared/normalize_imports';

describe('Delta typeguard functions', () => {
   it('should evaluate DeltaStatic object as not a DeltaObj type', function() {
      expect(isDeltaObj(new Delta().insert('a'))).to.be.false;
   });

   it('should evaluate DeltaObj object as type DeltaObj', function() {
      expect(isDeltaObj({
          a: 'textAnswer a',
          b: 'textAnswer b',
          c: new Delta().insert('textAnswer c')
      })).to.be.true;
   });
});