// llmNode.js

import BaseNode from './BaseNode';
import { NodeData } from '@/utils/type';

export const LLMNode = ({ id, data }: {id:string, data:NodeData}) => {

  return (
    < BaseNode label="LLM" id={id} data={data} />
  );
}