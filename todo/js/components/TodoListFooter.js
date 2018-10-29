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

import RemoveCompletedTodosMutation from '../mutations/RemoveCompletedTodosMutation';

import React from 'react';
import { graphql } from 'react-relay';
import useResolveFragments from '../hooks/useResolveFragments';

const TodoListFooter = (props) => {
  const { viewer, relay: { environment } } = useResolveFragments(
    props, 
    fragments
  )

  const _handleRemoveCompletedTodosClick = () => {
    const edges = viewer.todos.edges.filter(
      edge => edge.node.complete === true,
    );
    RemoveCompletedTodosMutation.commit(
      environment,
      {
        edges,
      },
      viewer,
    );
  };

  const numCompletedTodos = viewer.completedCount;
  const numRemainingTodos = viewer.totalCount - numCompletedTodos;
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{numRemainingTodos}</strong> item
        {numRemainingTodos === 1 ? '' : 's'} left
      </span>
      {numCompletedTodos > 0 && (
        <button
          className="clear-completed"
          onClick={_handleRemoveCompletedTodosClick}>
          Clear completed
        </button>
      )}
    </footer>
  );
}

export default TodoListFooter;

const fragments = graphql`
  fragment TodoListFooter_viewer on User {
    id
    completedCount
    todos(
      first: 2147483647 # max GraphQLInt
    ) @connection(key: "TodoList_todos") {
      edges {
        node {
          id
          complete
        }
      }
    }
    totalCount
  }
`
