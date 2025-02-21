import styled from 'styled-components';
import Task from './Task';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddTask from './AddTask';


const Container = styled.div`
    margin: 8px;
    border: 2px solid #22a3ff;
    border-radius: 5px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10px;
    background-color: #67e3ff;
`;
const Title = styled.h3`
    padding: 5px;
`;
const TaskList = styled.div`
    padding: 8px;
`;

const Column = (props) => {
    function deleteColumn(columnId, index) {
        const columnTasks = props.board.columns[columnId].taskIds;

        const finalTasks = columnTasks.reduce((previousValue, currentValue) => {
            const {[currentValue]: oldTask, ...newTasks} = previousValue;
            return newTasks;
        }, props.board.tasks);

        const columns = props.board.columns;
        const {[columnId]: oldColumn, ...newColumns} = columns;

        const newColumnOrder = Array.from(props.board.columnOrder);
        newColumnOrder.splice(index, 1);

        props.setBoard({
            tasks: {
                ...finalTasks,
            },
            columns: {
                ...newColumns,
            },
            columnOrder: newColumnOrder
        });
    }
  return (
    <Draggable draggableId={props.column.id} index={props.index} >
        {provided => (
        <Container {...provided.draggableProps} ref={provided.innerRef} >
            <Title {...provided.dragHandleProps}>{props.column.title}
                <span style={{color:"red"}} onClick={() => deleteColumn(props.column.id, props.index)}> &nbsp; &nbsp; x</span>
            </Title>
            <Droppable droppableId={props.column.id} type='task' >
                {provided => (
                <TaskList {...provided.droppableProps} ref={provided.innerRef}>
                    {props.tasks?.map((task, index) => (
                        <Task key={task.id} task={task} index={index} columnId={props.column.id} board={props.board} setBoard={props.setBoard} />))
                    }
                {provided.placeholder}
                <AddTask board={props.board} setBoard={props.setBoard} columnId={props.column.id} />
                </TaskList>
                )}
            </Droppable>
        </Container>
        )}
    </Draggable>
  )
}

export default Column