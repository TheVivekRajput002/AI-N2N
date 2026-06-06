// inputNode.js

import BaseNode from './BaseNode'
import { NodeData } from '@/utils/type';

export const InputNode = ({ id, data }: { id:string, data:NodeData}) => {

  return (
    < BaseNode label="Input" id={id} data={data} />
  );
}