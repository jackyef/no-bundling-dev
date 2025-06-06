const navigation = [
  { name: 'NO BUNDLE', href: '#' }
]

export const Header = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 px-8">
        <div className="flex flex-1" />
        <div className="flex gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex flex-1 justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
