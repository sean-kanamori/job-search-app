/** Shared shape for Server Actions used with React's useActionState,
 * so a validation failure (bad input, a file that's too big, a
 * duplicate email) shows inline instead of crashing to Next's
 * generic error page. */
export type ActionState = { error?: string };

export const initialActionState: ActionState = {};
