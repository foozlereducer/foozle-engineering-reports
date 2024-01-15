/**
 * Merge Object - Can merge two object literals
 */
export class MergeObjs {
  /**
   * Merge - executes the merge of the two objects
   * @param aObj - the first object literal
   * @param bObj - the second object literal
   * @returns object - a single object literal that contains the content of both objects
   */
  merge(aObj, bObj) {
    return {
      ...aObj,
      ...bObj,
    };
  }
}
