// draggableNode.js

export const DraggableNode = ({ type, label }: { type: string, label: string }) => {
  const onDragStart = (event: any, nodeType: string) => {
    const appData = { nodeType }
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={(event: any) => onDragStart(event, type)}
      onDragEnd={(event: any) => (event.target.style.cursor = 'grab')}
      className={`z-100  min-w-[80px] h-[40px] rounded-xl flex items-center flex-col justify-center bg-[var(--draggable-node-bg-color)] ${type}`}
      style={{
        cursor: 'grab',
      }}
      draggable
    >
      <span className="text-black">{label}</span>
    </div>
  );
};