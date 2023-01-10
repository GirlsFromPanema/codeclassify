const { getApi } = require("./api");

const { pointerSize } = Process;

let cachedModule = null;

module.exports = {
  get() {
    if (cachedModule === null) cachedModule = compileModule();
    return cachedModule;
  },
};

function compileModule() {
  const { objc_getClassList, class_getSuperclass, class_getInstanceSize } =
    getApi();

  const selfTask = Memory.alloc(4);
  selfTask.writeU32(Module.getExportByName(null, "mach_task_self_").readU32());

  const cm = new CModule(code, {
    objc_getClassList,
    class_getSuperclass,
    class_getInstanceSize,
    malloc_get_all_zones: Module.getExportByName(
      "/usr/lib/system/libsystem_malloc.dylib",
      "malloc_get_all_zones"
    ),
    selfTask,
  });

  const _choose = new NativeFunction(cm.choose, "pointer", [
    "pointer",
    "bool",
    "pointer",
  ]);
  const _destroy = new NativeFunction(cm.destroy, "void", ["pointer"]);

  return {
    handle: cm,
    choose(klass, considerSubclasses) {
      const result = [];

      const countPtr = Memory.alloc(4);
      const matches = _choose(klass, considerSubclasses ? 1 : 0, countPtr);
      try {
        const count = countPtr.readU32();
        for (let i = 0; i !== count; i++)
          result.push(matches.add(i * pointerSize).readPointer());
      } finally {
        _destroy(matches);
      }

      return result;
    },
  };
}
