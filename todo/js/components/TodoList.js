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

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React from 'react';
import { graphql } from 'react-relay';
import useResolveFragments from '../hooks/useResolveFragments';

const TodoList  = (props) => {
  const { viewer, relay: { environment } } = useResolveFragments(
    props, 
    fragments
  );

  const _handleMarkAllChange = e => {
    const complete = e.target.checked;
    MarkAllTodosMutation.commit(
      environment,
      complete,
      viewer.todos,
      viewer,
    );
  };

  const numTodos = viewer.totalCount;
  const numCompletedTodos = viewer.completedCount;

  return (
    <section className="main">
      <input
        checked={numTodos === numCompletedTodos}
        className="toggle-all"
        onChange={_handleMarkAllChange}
        type="checkbox"
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">{
        viewer.todos.edges.map(edge => (
          <Todo 
            key={edge.node.id} 
            todo={edge.node} 
            viewer={viewer} 
          />
        ))
      }</ul>
    </section>
  );
}

export default TodoList;

const fragments = graphql`
  fragment TodoList_viewer on User {
    todos(
      first: 2147483647 # max GraphQLInt
    ) @connection(key: "TodoList_todos") {
      edges {
        node {
          id
          complete
          ...Todo_todo
        }
      }
    }
    id
    totalCount
    completedCount
    ...Todo_viewer
  }
`
