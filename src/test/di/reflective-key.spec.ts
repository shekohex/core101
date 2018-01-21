/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { KeyRegistry } from '../../di/reflective-key';
import { expect } from 'chai';

describe('key', () => {
  let registry: KeyRegistry;

  beforeEach(() => {
    registry = new KeyRegistry();
  });

  it('should be equal to another key if type is the same', () => {
    expect(registry.get('car')).to.equal(registry.get('car'));
  });

  it('should not be equal to another key if types are different', () => {
    expect(registry.get('car')).not.to.equal(registry.get('porsche'));
  });

  it('should return the passed in key', () => {
    expect(registry.get(registry.get('car'))).to.equal(registry.get('car'));
  });
});
