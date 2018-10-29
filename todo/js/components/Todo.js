/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation from '../mutations/RemoveTodoMutation';
import RenameTodoMutation from '../mutations/RenameTodoMutation';
import TodoTextInput from './TodoTextInput';
import useResolveFragments from '../hooks/useResolveFragments';

import React, { useState } from 'react';
import { graphql} from 'react-relay';
import classnames from 'classnames';

const Todo = (props) => {
  const { todo, viewer, relay: { environment }} = useResolveFragments(props, fragments)
  const [isEditing, setIsEditing] = useState(false);

  const  _handleCompleteChange = e => {
    const complete = e.target.checked;
    ChangeTodoStatusMutation.commit(
      environment,
      complete,
      todo,
      viewer,
    );
  };

  const _handleDestroyClick = () => {
    _removeTodo();
  };

  const _handleLabelDoubleClick = () => {
    setIsEditing(true);
  };

  const _handleTextInputCancel = () => {
    setIsEditing(false);
  };

  const _handleTextInputDelete = () => {
    setIsEditing(false);
    _removeTodo();
  };

  const _handleTextInputSave = text => {
    setIsEditing(false);
    RenameTodoMutation.commit(
      environment,
      text,
      todo,
    );
  };

  const _removeTodo = () => {
    RemoveTodoMutation.commit(
      environment,
      todo,
      viewer,
    );
  }


  return (
    <li
      className={classnames({
        completed: todo.complete,
        editing: isEditing,
      })}>
      <div className="view">
        <input
          checked={todo.complete}
          className="toggle"
          onChange={_handleCompleteChange}
          type="checkbox"
        />
        <label onDoubleClick={_handleLabelDoubleClick}>
          {todo.text}
        </label>
        <button className="destroy" onClick={_handleDestroyClick} />
      </div>
      {isEditing && (
        <TodoTextInput
          className="edit"
          commitOnBlur={true}
          initialValue={todo.text}
          onCancel={_handleTextInputCancel}
          onDelete={_handleTextInputDelete}
          onSave={_handleTextInputSave}
        />
      )}
    </li>
  );
}   

const fragments = graphql`
  fragment Todo_todo on Todo {
    complete
    id
    text
  }

  fragment Todo_viewer on User {
    id
    totalCount
    completedCount
  }
`

export default Todo
