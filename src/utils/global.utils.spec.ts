import { copyDefinedProperties } from './global.utils';

describe('copyDefinedProperties', () => {
   it('should copy only defined values', () => {
       // Given we have a source and target objects
       const srcObj1: any = { a: 'srcValue1', b: undefined, c: null, d: true, e: 'srcValueE', f: null, g: 'srcValueG' };
       const targetObj: any = { a: 'targetValueA', b: true, c: 'targetValueC', d: null, e: undefined };

       // When copying source properties into target
       const result = copyDefinedProperties(targetObj, srcObj1);

       // Then it should have created a new object
       expect(result).not.toBe(targetObj);
       // And copied only defined values
       expect(result).toEqual({ a: 'srcValue1', b: true, c: 'targetValueC', d: true, e: 'srcValueE', g: 'srcValueG' });
       // And should not have modified the target object
       expect(targetObj).toEqual({ a: 'targetValueA', b: true, c: 'targetValueC', d: null, e: undefined });
   });
   it('should return a copy of target object if source is null', () => {
       // Given we have a defined target object
       const targetObj: any = { a: 'targetValueA', b: true };

       // When copying source properties into target
       const resultNull = copyDefinedProperties(targetObj, null);
       const resultUndefined = copyDefinedProperties(targetObj, undefined);

       // Then it should not have modified the target object
       expect(resultNull).toEqual({ a: 'targetValueA', b: true });
       expect(targetObj).not.toBe(resultNull);
       expect(resultUndefined).toEqual({ a: 'targetValueA', b: true });
       expect(targetObj).not.toBe(resultUndefined);
   });
   it('should return null if target is null', () => {
       // Given we have a defined target object
       const srcObj: any = { a: 'sourceA', b: true, c: null };

       // When copying source properties into target
       const targetNull = copyDefinedProperties(null, srcObj);
       const targetUndefined = copyDefinedProperties(undefined, srcObj);
       const targetNullSrcNull = copyDefinedProperties(null, null);
       const targetNullSrcUndefined = copyDefinedProperties(null, undefined);
       const targetNullSrcPrimitive = copyDefinedProperties(null, 5);
       const targetPrimitiveSrcPrimitive = copyDefinedProperties(5, 5);

       // Then it should not crash and return null
       expect(targetNull).toBe(null);
       expect(targetUndefined).toBe(null);
       expect(targetNullSrcNull).toBe(null);
       expect(targetNullSrcUndefined).toBe(null);
       expect(targetNullSrcPrimitive).toBe(null);
       expect(targetPrimitiveSrcPrimitive).toBe(null);
   });
});
