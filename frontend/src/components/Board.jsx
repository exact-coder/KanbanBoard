import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import AddColumn from './AddColumn';

const Container = styled.div`
display: flex;
`

function Board(props) {
    const initialData = {tasks: {}, columns: {}, columnOrder: []};
    const [board, setBoard] = useState(initialData);
  
    async function fetchBoard(){
      const response = await fetch("http://localhost:8000/board");
      const data = await response.json();
      console.log(data);
      return data.board;
    }
  
    useEffect(() => {
      fetchBoard().then(data => setBoard(data));
    }, []);

    function onDragEnd(result) {
      const { destination, source, draggableId, type } = result;

      if(!destination){
        return;
      }
      if(destination.droppableId === source.droppableId && destination.index === source.index){
        return;
      }

      if(type === 'column'){
        const newColumnOrder = Array.from(board.columnOrder);
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);

        setBoard({
          ...board,
          columnOrder: newColumnOrder,
        });

        return;
      };

      const start = board.columns[source.droppableId];
      const finish = board.columns[destination.droppableId];

      if( start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...start,
          taskIds: newTaskIds,
        };

        setBoard({
          ...board,
          columns: {
            ...board.columns,
            [newColumn.id]: newColumn
          }
        });
        return;
      };

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStartColumn = {
        ...start,
        taskIds: startTaskIds
      };
      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinishColumn = {
        ...finish,
        taskIds: finishTaskIds,
      };
      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        }
      });
      return;
      
    }
  
  


    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <AddColumn board={board} setBoard={setBoard} />
        <Droppable droppableId='all-columns' direction='horizontal' type='column' >
          {provided => (
          <Container {...provided.droppableProps} ref={provided.innerRef} >
              {board?.columnOrder?.map((columnId, index) => {
                const column = board.columns[columnId];
                const tasks = column.taskIds?.map(taskIds => board.tasks[taskIds]);
                return <Column key={column.id} column={column} tasks={tasks} index={index} board={board} setBoard={setBoard} />;
              })}
            {provided.placeholder}
          </Container>
          )}
        </Droppable>
      </DragDropContext>
    )
}

export default Board;