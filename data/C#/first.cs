using System;
using C5;

namespace Dataflow.Core
{
    public class Engine
    {
        ArrayList<PatchContainer> rootSet = new ArrayList<PatchContainer>();
        HashDictionary<IPatch, PatchContainer> mapping = new HashDictionary<IPatch, PatchContainer>();

        public Engine()
        {
        }

        public void Add(IPatch patch)
        {
            PatchContainer pc = new PatchContainer(patch);
            mapping.Add(patch, pc);
            rootSet.Add(pc);
        }

        public void Connect(IPatch from, string outlet, IPatch to, string inlet)
        {
            PatchContainer fromCont = mapping[from];
            PatchContainer toCont = mapping[to];
            rootSet.Remove(toCont);

            fromCont.GetOutlet(outlet).ConnectTo(toCont.GetInlet(inlet));
        }
        public void StepFrame()
        {
            LinkedList<IPatchContainer> executionQueue = new LinkedList<IPatchContainer>();
            HashedLinkedList<IPatchContainer> discoveredSet = new HashedLinkedList<IPatchContainer>();

            executionQueue.AddAll(this.rootSet);

            do
            {
                while (executionQueue.Count > 0)
                {
                    IPatchContainer patch = executionQueue.RemoveFirst();
                    patch.ExecutePatch();
                    foreach (IOutlet outlet in patch.Outlets)
                        outlet.PropagateChanges(discoveredSet);
                }
                if (discoveredSet.Count > 0)
                {
                    executionQueue.AddAll(discoveredSet);
                    discoveredSet.Clear();
                }
            } while (executionQueue.Count > 0);
        }
    }
}