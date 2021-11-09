using UnityEngine.Events;
using UnityEngine;

public class DevTool : MonoBehaviour
{
    public Cheats[] cheats;
    void Update()
    {
        for (int i = 0; i < cheats.Length; i++)
        {
            string key = cheats[i].input.ToString();
            string secondKey = cheats[i].input.ToString();

			switch (cheats[i].extraInput)
			{
                case TypeInput.Default:
                if (Input.GetButtonDown(key)&&Input.GetButton(secondKey))
                {
					if (cheats[i].function != null)
					{
                            Debug.LogError("Did not assign function. Click on the pluss button " +
                           "and add a fuction void. Afther that select a fuction that you want to be called");
                    }
					else
                    { 
                        cheats[i].function.Invoke();
					}
                }
                break;
                case TypeInput.Ctrl:
                if (Input.GetButtonDown(key) && Input.GetButton(secondKey) && Input.GetButton("Ctrl"))
                {
                    if (cheats[i].function != null)
                    {
                            Debug.LogError("Did not assign function. Click on the pluss button " +
                           "and add a fuction void. Afther that select a fuction that you want to be called");
                    }
                    else
                    {
                        cheats[i].function.Invoke();
                    }
                }
                break;
                case TypeInput.Shift:
                if (Input.GetButtonDown(key) && Input.GetButton(secondKey) && Input.GetButton("Shift"))
                {
                    if (cheats[i].function != null)
                    {
                            Debug.LogError("Did not assign function. Click on the pluss button " +
                                "and add a fuction void. Afther that select a fuction that you want to be called");
                    }
                    else
                    {
                        cheats[i].function.Invoke();
                    }
                }
                break;
                default:
				{
                        Debug.LogError("Did not assign Input");
				}
                break;
			}
        }
    }
    [System.Serializable]
    public struct Cheats
    {
        public UnityEvent function;
        public Key input;
        public Key secondInput;
        public TypeInput extraInput;
    }
}
public enum TypeInput
{
    Default  = 1,
    Ctrl = 2,
    Shift = 3,
}
public enum Key
{
    q = 1,
    w = 2,
    e = 3,
    r = 4,
    t = 5,
    y = 6,
    u = 7,
    i = 8,
    o = 9,
    p = 10,
    a = 11,
    s = 12,
    d = 13,
    f = 14,
    g = 15,
    h = 16,
    j = 17,
    k = 18,
    l = 19,
    z = 20,
    x = 21,
    c = 22,
    v = 23,
    b = 24,
    n = 25,
    m = 26,
    _0 = 27,
    _1 = 28,
    _2 = 29,
    _3 = 30,
    _4 = 31,
    _5 = 31,
    _6 = 32,
    _7 = 33,
    _8 = 34,
    _9 = 35,
}