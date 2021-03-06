/*!***************************************************
 * mark.js
 * https://github.com/julmot/mark.js
 * Copyright (c) 2014–2018, Julian Kühnel
 * Released under the MIT license https://git.io/vwTVl
 *****************************************************/
'use strict';
describe('mark with acrossElements in an empty context', function() {
  var $ctx1, $ctx2, done1 = false,
    done2 = false;
  beforeEach(function(done) {
    loadFixtures('across-elements/basic/empty.html');

    $ctx1 = $('.notExistingSelector');
    $ctx2 = $('.across-elements-empty');
    new Mark($ctx1[0]).mark('lorem', {
      'diacritics': false,
      'separateWordSearch': false,
      'acrossElements': true,
      'done': function() {
        done1 = true;
        new Mark($ctx2[0]).mark('lorem', {
          'diacritics': false,
          'separateWordSearch': false,
          'done': function() {
            done2 = true;
            done();
          }
        });
      }
    });
  });

  it('should call the done function', function() {
    expect(done1).toBe(true);
    expect(done2).toBe(true);
  });
});
