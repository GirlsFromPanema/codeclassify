using System;
using C5;

namespace Dataflow.Core
{
    public enum ActivationMode
    {

        Passive,


        ActivateOnMessage,


        ActivateOnChange
    }
}

public class Inlet<T> : IInlet
{
    IPatchContainer patch;
    string name;
    T value;
    int frame;
    ActivationMode mode;
    bool valueChanged;
}