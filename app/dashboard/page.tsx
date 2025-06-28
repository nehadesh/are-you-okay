import News from "./News";

export default function SetupPage() {
  return (
    <>
    <div className="bg-gray-50 py-24 sm:py-32">
  <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
    <p className="mx-auto mt-2 max-w-lg text-center text-2xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">Everything you need to deploy your app</p>
    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2 lg:grid-rows-2">
      <div className="relative lg:row-span-2">
        <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl"></div>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
          <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
            <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Mobile friendly</p>
            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.</p>
          </div>
          <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
            <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
              <img className="size-full object-cover object-top" src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png" alt="" />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl"></div>
      </div>
      <div className="relative max-lg:row-start-1">
        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl"></div>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
          <div className="px-8 pt-8 sm:px-10 sm:pt-10">
            <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Performance</p>
            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.</p>
            <News location="San Francisco" />
          </div>
          <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
            <img className="w-full max-lg:max-w-xs" src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png" alt="" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl"></div>
      </div>
      <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
        <div className="absolute inset-px rounded-lg bg-white"></div>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
          <div className="px-8 pt-8 sm:px-10 sm:pt-10">
            <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Security</p>
            <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.</p>
          </div>
          <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
            <img className="h-[min(152px,40cqw)] object-cover" src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png" alt="" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5"></div>
      </div>
    </div>
  </div>
</div>
</>
  );
}
