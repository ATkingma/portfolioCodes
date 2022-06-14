using System.Collections.Generic;

namespace BehaviorTree
{
    public class Selector : Node
    {
        public Selector() : base() { }
        public Selector(List<Node> children) : base(children) { }

        public override NodeState Evaluate()
        {
            foreach (Node node in children)
            {
                switch (node.Evaluate())
                {
                    case NodeState.failure:
                        continue;
                    case NodeState.succes:
                        state = NodeState.succes;
                        return state;
                    case NodeState.running:
                        state = NodeState.running;
                        return state;
                    default:
                        continue;
                }
            }

            state = NodeState.failure;
            return state;
        }

    }

}
