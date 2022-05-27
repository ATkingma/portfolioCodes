using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using UnityEditor.SceneManagement;

[InitializeOnLoad]
[CustomEditor(typeof(PlayerPrefChanger))]
public class PlayerPrefChanger : EditorWindow
{
    public enum TypePref
    {
        Float = 0,
        Int = 1,
        String = 2,
    }
    private static string _playerPrefName;
    private static float _float;
    private static int _int;
	private static string _string;
    private static bool _console;
    public TypePref tP;
    [MenuItem("Tools/Prefab Editor")]
    static void MenuItem()
    {
        PlayerPrefChanger window = (PlayerPrefChanger)GetWindowWithRect(
          typeof(PlayerPrefChanger), new Rect(0, 0, 160, 60));
        window.Show();
    }
    #region UI
    void OnGUI()
    {
        tP = (TypePref)EditorGUILayout.EnumPopup("Primitive to create:", tP);
        _console = GUI.Toggle(new Rect(550, 90, 100, 30), _console, "Console");
        _playerPrefName = EditorGUILayout.TextField("Name of PlayerPref", _playerPrefName);
        if (GUI.Button(new Rect(10, 90, 200, 25), "Change PlayerPref"))
        {
            InstantiatePrimitive();
        }
        if (GUI.Button(new Rect(250, 90, 200, 25), "Reset Values"))
        {
            float_ = 0;
            int_ = 0;
            string_ = null;
			playerPrefName = null;
            Debug.Log("Resetted Values");
        }
        if (GUI.Button(new Rect(10, 120, 600, 30), "Clear all PlayerPrefs"))
        {
            PlayerPrefs.DeleteAll();
			if (_console)
			{
                Debug.Log("Cleared al PlayerPrefs");
			}
        }
        switch (tP)
        {
            case TypePref.Float:
                float_ = EditorGUILayout.FloatField("Float", _float);
                break;
            case TypePref.Int:
                int_ = EditorGUILayout.IntField("Int", _int);
                break;
            case TypePref.String:
                string_ = EditorGUILayout.TextField("String", _string);
                break;
            default:
                Debug.LogError("Unrecognized Option");
                break;
        }
    }
	#endregion
	#region save pref
	void InstantiatePrimitive()
    {
        switch (tP)
        {
            case TypePref.Float:
                PlayerPrefs.SetFloat(_playerPrefName, float_);
                if (console)
                {
                    Debug.Log("Changed " + _playerPrefName + " To " + _float);
                }
                break;
            case TypePref.Int:
                PlayerPrefs.SetInt(_playerPrefName, int_);
                if (console)
                {
                    Debug.Log("Changed " + _playerPrefName + " To " + _int);
                }
                break;
            case TypePref.String:
                PlayerPrefs.SetString(_playerPrefName, string_);
				if (console)
				{
                    Debug.Log("Changed "+ _playerPrefName + " To " + _string);
				}
                break;
            default:
                Debug.LogError("Unrecognized Option");
                break;
        }
    }
    #endregion
}