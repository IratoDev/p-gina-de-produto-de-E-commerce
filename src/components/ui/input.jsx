export function InputComponet({ className = '', ...props }) {
  return (
    <input
      className={`border rounded-xl p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
