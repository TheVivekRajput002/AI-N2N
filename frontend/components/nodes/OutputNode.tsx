// outputNode.js
import BaseNode from './BaseNode'
import { NodeData } from '@/utils/type';

export const OutputNode = ({ id, data }: { id:string, data:NodeData }) => {

  return (
    < BaseNode label="Output" id={id} data={data} />
  );
}