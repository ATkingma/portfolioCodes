using System.Collections.Generic;

namespace BehaviorTree
{
    public class Sequence : Node
    {
        public Sequence() : base() { }
        public Sequence(List<Node> children) : base(children) { }

        public override NodeState Evaluate()
        {
            bool anyChildIsRunning = false;

            foreach (Node node in children)
            {
                switch (node.Evaluate())
                {
                    case NodeState.failure:
                        state = NodeState.failure;
                        return state;
                    case NodeState.succes:
                        continue;
                    case NodeState.running:
                        anyChildIsRunning = true;
                        continue;
                    default:
                        state = NodeState.succes;
                        return state;
                }
            }

            state = anyChildIsRunning ? NodeState.running : NodeState.succes;
            return state;
        }

    }

}
