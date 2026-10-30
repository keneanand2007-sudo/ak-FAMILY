export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 shadow-sm disabled:opacity-60 active:scale-95';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600',
  };

  return (
    <button className={base + ' ' + variants[variant] + ' ' + className} {...props}>
      {children}
    </button>
  );
}
