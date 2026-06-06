// textNode.js
import BaseNode from "./BaseNode";
import { NodeData } from "@/utils/type";

export const TextNode = ({ id, data }: {id:string, data:NodeData}) => {

  return (
    < BaseNode label="Text" id={id} data={data} />
  );
}