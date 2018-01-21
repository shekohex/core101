/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { expect } from 'chai';
import { Type } from '../../di/facade/type';
import { forwardRef, resolveForwardRef } from '../../di';

describe('forwardRef', () => {
  it('should wrap and unwrap the reference', () => {
    const ref = forwardRef(() => String);
    expect(ref instanceof Type).to.be.true;
    expect(resolveForwardRef(ref)).to.be.string;
  });
});
