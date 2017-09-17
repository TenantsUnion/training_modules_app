import {expect} from 'chai';
import {coursesHandler} from "../server/src/config/handler.config";

describe('hello world test', () => {
   it('should run a test', () => {
       expect(coursesHandler).to.not.be.null;
   });
});