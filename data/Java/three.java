package org.borium.javarecompiler;

public class Recompiler
{
	public static boolean instructionComments = false;

	public static boolean stackComments = false;

	public static boolean dumpInstructions = false;

	public static boolean dumpStatements = false;

	public static HashMap<String, ClassFile> processedClasses = new HashMap<>();

	private static ArrayList<String> processedClassNames = new ArrayList<>();

	public static HashMap<String, String> simpleClassNames = new HashMap<>();

	public static void main(String[] args)
	{
		Recompiler recompiler = new Recompiler();
		for (int argc = 0; argc < args.length; argc += 2)
		{
			switch (args[argc])
			{
			case "-classpath":
				recompiler.addClassPath(args[argc + 1]);
				break;
			case "-outputpath":
				recompiler.setOutputPath(args[argc + 1]);
				break;
			case "-mainclass":
				recompiler.setMainClass(args[argc + 1]);
				break;
			case "-vs":
				recompiler.setVisualStudio(args[argc + 1]);
				break;
			case "-comments":
				recompiler.setCommentLevel(args[argc + 1]);
				break;
			default:
				throw new RuntimeException("Unsupported argument " + args[argc]);
			}
		}
		recompiler.run();
		System.out.println("Done.");
	}
}